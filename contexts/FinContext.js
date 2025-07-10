import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from "expo-sqlite";
import React, { useEffect, useRef, useState } from 'react';

const formatValue = (num) => Math.round((num + Number.EPSILON) * 100) / 100

async function openDatabase() {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        await FileSystem.downloadAsync(
            Asset.fromModule(require('../assets/finDatabase.db')).uri,
            FileSystem.documentDirectory + 'SQLite/finDatabase.db'
        );
    }
    const db = await SQLite.openDatabaseAsync('finDatabase.db');
    console.log('Database opened:', db);
    db.current.runAsync(
        [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
        false,
        () => { },
    );
    console.log('Foreign keys enabled');
    return db;
}

const initialContext = {
    actions: {
        addCategory: async (category) => { },
        updateCategory: async (category) => { },
        deleteCategory: async (id) => { },
        addTransaction: async (transaction) => { },
        updateTransaction: async (transaction) => { },
        deleteTransaction: async (id) => { },
        restoreBackup: async (uri) => { },
        refresh: async () => { }
    },
    categories: [],
    transactions: [],
};

export const finContext = React.createContext(initialContext);

export const FinProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const db = useRef();

    useEffect(() => {
        (async () => {
            db.current = await openDatabase();
            await refresh();
            setIsLoading(false);
        })();
    }, [])

    const restoreBackup = async (uri) => {
        // @ts-ignore
        db.current._db.close();
        await FileSystem.moveAsync({
            from: uri,
            to: FileSystem.documentDirectory + 'SQLite/finDatabase.db'
        });
        db.current = await SQLite.openDatabaseAsync('finDatabase.db');
        await db.current.execAsync('PRAGMA foreign_keys = ON;');
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
        db.current.runAsync(sql, values)
        const res = await db.current.executeSql(sql, values)
        return res.insertId;

    }

    const deleteEntity = async (name, id) => {
        await new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${name} WHERE id = ${id}`
            // execute sql
            db.current.transaction(tx => {
                tx.executeSql(sql, null,
                    (txObj, resultSet) => {
                        return resolve()
                    },
                    (txObj, error) => {
                        return reject(error)
                    }
                )
            });
        })
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
        await new Promise((resolve, reject) => {
            const sql = `UPDATE category SET 
                    name = '${category.name}'
                    ,listIndex = ${category.index}
                    ,parentId = ${category.parentId}
                WHERE id = ${category.id}`
            // execute sql
            db.current.transaction(tx => {
                tx.executeSql(sql, null,
                    (txObj, resultSet) => {
                        return resolve()
                    },
                    (txObj, error) => {
                        return reject(error)
                    }
                )
            });
        })
        refresh();
    }

    const deleteCategory = async (id) => {
        await deleteEntity('category', id);
        refresh();
    }

    const addTransaction = async (transaction) => {
        const id = await createEntity('finTransaction', {
            name: transaction.name,
            value: transaction.value,
            details: transaction.details,
            date: transaction.date.toISOString(),
            categoryId: transaction.categoryId,
        });
        refresh();
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
        const res = await db.current.execAsync(sql)
        await refresh();
    }

    const deleteTransaction = async (id) => {
        await deleteEntity('finTransaction', id);
        refresh();
    }

    const fetchCategories = async (date) => {
        console.log('Fetching categories with date:', date);
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
        const rows = await db.current.getAllAsync(getCategoriesSQL);
        const fetchedCategories = rows.map(c => {
            return {
                id: c.id,
                name: c.name,
                index: c.listIndex,
                parentId: c.parentId,
                value: formatValue(c.value),
            }
        })
        console.log('Fetched categories:', fetchedCategories[0]);
        setCategories(fetchedCategories);
    }

    const fetchTransactions = async () => {
        const getTransactionsSQL = `SELECT * FROM FinTransaction ORDER BY date desc`;
        const rows = await db.current.getAllAsync(getTransactionsSQL);
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
                    restoreBackup
                },
                isLoading,
                categories,
                transactions
            }}
        >
            {children}
        </finContext.Provider>
    );
};
