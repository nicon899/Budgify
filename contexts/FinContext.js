import { SQLite, useSQLiteContext } from 'expo-sqlite';

import React, { useEffect, useState } from 'react';

const formatValue = (num) => Math.round((num + Number.EPSILON) * 100) / 100


const initialContext = {
    actions: {
        addCategory: async (category) => { },
        updateCategory: async (category) => { },
        deleteCategory: async (id) => { },
        addTransaction: async (transaction) => { },
        updateTransaction: async (transaction) => { },
        deleteTransaction: async (id) => { },
        restoreBackup: async (uri) => { },
        refresh: async () => { },
        addTemplate: async (template) => { },
        updateTemplate: async (template) => { },
        deleteTemplate: async (id) => { },
        fetchTemplates: async () => { },
        fetchTemplateTransactions: async (templateId) => { },
        addTemplateTransaction: async (transaction) => { },
        updateTemplateTransaction: async (transaction) => { },
        deleteTemplateTransaction: async (id) => { },
        fetchTemplateTransaction: async (transactionId) => { },
    },
    categories: [],
    transactions: [],
    templates: [],
};

export const finContext = React.createContext(initialContext);

export const FinProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const db = useSQLiteContext();


    useEffect(() => {
        (async () => {
            await refresh();
            setIsLoading(false);
        })();
    }, [])

    const restoreBackup = async (uri) => {
        // 1) Load the backup file into memory
        const backupFile = new File(uri);
        const bytes = await backupFile.bytes(); // Uint8Array

        // 2) Turn the bytes into a *source* SQLite database (in-memory)
        const src = await SQLite.deserializeDatabaseAsync(bytes);

        try {
            // 3) Copy source -> destination (the provider DB) atomically
            await SQLite.backupDatabaseAsync({
                sourceDatabase: src,
                sourceDatabaseName: 'main',
                destDatabase: db,
                destDatabaseName: 'main',
            });

            // 4) Your PRAGMAs or post-restore hooks
            await db.execAsync('PRAGMA foreign_keys = ON;');
        } finally {
            // 5) Always clean up the temp source DB
            await src.closeAsync();
        }

        // 6) Refresh your UI/data
        await refresh();
    }

    const createEntity = async (name, entity) => {
        // create sql statement
        let columns = '', qms = '', values = [];
        for (const [key, value] of Object.entries(entity)) {
            columns += `${key},`;
            qms += '?,'
            values.push(value)
        }
        columns = columns.slice(0, -1);
        qms = qms.slice(0, -1);
        const sql = `INSERT INTO ${name} (${columns}) VALUES (${qms})`
        try {
            const res = await db.runAsync(sql, values)
            return res.insertId;
        } catch (error) {
            console.error('Error executing SQL:', error);
            throw error;
        }
    }

    const deleteEntity = async (name, id) => {
        const sql = `DELETE FROM ${name} WHERE id = ${id}`
        await db.execAsync(sql);
    }

    const addCategory = async (category) => {
        const id = await createEntity('category', {
            name: category.name,
            listIndex: category.index,
            parentId: category.parentId
        });
        refresh();
        return id;
    }

    const updateCategory = async (category) => {
        const sql = `UPDATE category SET 
                    name = '${category.name}'
                    ,listIndex = ${category.index}
                    ,parentId = ${category.parentId}
                WHERE id = ${category.id}`
        // execute sql
        await db.execAsync(sql)
        await refresh();
    }

    const deleteCategory = async (id) => {
        await deleteEntity('category', id);
        await refresh();
    }

    const addTransaction = async (transaction) => {
        const id = await createEntity('finTransaction', {
            name: transaction.name,
            value: transaction.value,
            details: transaction.details,
            date: transaction.date.toISOString(),
            categoryId: transaction.categoryId,
        });
        await refresh();
        return id;
    }

    const updateTransaction = async (transaction) => {
        const sql = `UPDATE finTransaction SET 
                    name = '${transaction.name}'
                    ,value = ${transaction.value}
                    ,details = '${transaction.details}'
                    ,date = '${transaction.date.toISOString()}'
                    ,categoryId = ${transaction.categoryId}
                WHERE id = ${transaction.id}`
        // execute sql
        const res = await db.execAsync(sql)
        await refresh();
    }

    const deleteTransaction = async (id) => {
        await deleteEntity('finTransaction', id);
        await refresh();
    }

    const fetchCategories = async (date) => {
        const getCategoriesSQL = `
            SELECT pc.*
            ,(SELECT SUM(value)
                FROM finTransaction
                WHERE
                ${date ? 'date <= \'' + date + '\' AND ' : ''} 
                categoryId IN (
                    WITH q AS
                            (
                            SELECT  id
                            FROM    category
                            WHERE   id = pc.id
                            UNION ALL
                            SELECT  c.id
                            FROM    category c
                            JOIN    q
                            ON      c.parentID = q.id
                            )
                    SELECT  *
                    FROM    q
                )) AS value
            FROM category pc
            UNION 
                SELECT NULL id, 'Total', 0, null
                ,(SELECT SUM(value) FROM finTransaction ${date ? 'WHERE date <= \'' + date + '\'' : ''})
            ORDER BY listIndex`;
        const rows = await db.getAllAsync(getCategoriesSQL);
        const fetchedCategories = rows.map(c => {
            return {
                id: c.id,
                name: c.name,
                index: c.listIndex,
                parentId: c.parentId,
                value: formatValue(c.value),
            }
        })
        setCategories(fetchedCategories);
    }

    const fetchTransactions = async () => {
        const getTransactionsSQL = `SELECT * FROM FinTransaction ORDER BY date desc`;
        const rows = await db.getAllAsync(getTransactionsSQL);
        const fetchedTransactions = rows.map(t => {
            return {
                id: t.id,
                name: t.name,
                value: formatValue(t.value),
                details: t.details,
                date: new Date(t.date),
                categoryId: t.categoryId
            }
        })
        setTransactions(fetchedTransactions);
    }

    const addTemplate = async (template) => {
        const id = await createEntity('template', {
            name: template.name
        });
        return id;
    }

    const updateTemplate = async (template) => {
        const sql = `UPDATE template SET 
                    name = '${template.name}'
                WHERE id = ${template.id}`
        // execute sql
        await db.execAsync(sql)
        await refresh();
    }

    const deleteTemplate = async (id) => {
        await deleteEntity('template', id);
        await refresh();
    }

    const fetchTemplates = async () => {
        const getTemplatesSQL = `
            SELECT templ.*
            ,(SELECT SUM(value)
                FROM templateTransaction
                WHERE
                templateId = templ.id) AS value
            FROM template templ`;
        const rows = await db.getAllAsync(getTemplatesSQL);
        const fetchedTemplates = rows.map(c => {
            return {
                id: c.id,
                name: c.name,
                value: formatValue(c.value),
            }
        })
        setTemplates(fetchedTemplates);
    }

    const fetchTemplateTransactions = async (templateId) => {
        const getTransactionsSQL = `SELECT * FROM templateTransaction WHERE templateId = ${templateId}`;
        const rows = await db.getAllAsync(getTransactionsSQL);
        const fetchedTransactions = rows.map(t => {
            return {
                id: t.id,
                name: t.name,
                value: formatValue(t.value),
                details: t.details,
                dateOffset: t.dateOffset,
                categoryId: t.categoryId,
                templateId: t.templateId
            }
        })
        return fetchedTransactions;
    }

    const fetchTemplateTransaction = async (transactionId) => {
        const getTransactionsSQL = `SELECT * FROM templateTransaction WHERE id = ${transactionId}`;
        const fetchedTransaction = await db.getFirstAsync(getTransactionsSQL);
        return fetchedTransaction;
    }

    const addTemplateTransaction = async (transaction) => {
        const id = await createEntity('templateTransaction', {
            name: transaction.name,
            value: transaction.value,
            details: transaction.details,
            dateOffset: transaction.dateOffset,
            categoryId: transaction.categoryId,
            templateId: transaction.templateId,
        });
        return id;
    }

    const updateTemplateTransaction = async (transaction) => {
        const sql = `UPDATE templateTransaction SET 
                    name = '${transaction.name}'
                    ,value = ${transaction.value}
                    ,details = '${transaction.details}'
                    ,dateOffset = '${transaction.dateOffset}'
                    ,categoryId = ${transaction.categoryId}
                WHERE id = ${transaction.id}`
        // execute sql
        const res = await db.execAsync(sql)
    }

    const deleteTemplateTransaction = async (id) => {
        await deleteEntity('templateTransaction', id);
    }


    const refresh = async (date = null) => {
        await fetchCategories(date);
        await fetchTransactions();
    }

    return (
        <finContext.Provider
            value={{
                actions: {
                    refresh,
                    addCategory,
                    updateCategory,
                    deleteCategory,
                    addTransaction,
                    updateTransaction,
                    deleteTransaction,
                    restoreBackup,
                    addTemplate,
                    updateTemplate,
                    deleteTemplate,
                    fetchTemplates,
                    addTemplateTransaction,
                    updateTemplateTransaction,
                    deleteTemplateTransaction,
                    fetchTemplateTransactions,
                    fetchTemplateTransaction,
                },
                isLoading,
                categories,
                transactions,
                templates
            }}
        >
            {children}
        </finContext.Provider>
    );
};
