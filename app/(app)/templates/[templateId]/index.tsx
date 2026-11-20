import theme, { CURRENCY_SYMBOL } from '@/app/theme';
import DatePicker from '@/components/DatePicker';
import TemplateCategoryTree, {
    buildTemplateCategoryTree,
    getDefaultExpandedCategoryIds,
    getExecutionDate,
} from '@/components/TemplateCategoryTree';
import alert from '@/components/alert';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/types/Category';
import { Template } from '@/types/Template';
import { Transaction } from '@/types/Transaction';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const TemplateDetailScreen = () => {
    const { templateId: templateIdParamStr } = useLocalSearchParams();
    const templateId = templateIdParamStr ? parseInt(templateIdParamStr as string, 10) : null;
    const [template, setTemplate] = useState<Template | null>(null);
    const [categoryTree, setCategoryTree] = useState<Category[]>([]);
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
    const [hideEmptyCategories, setHideEmptyCategories] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExecuting, setIsExecuting] = useState(false);
    const [nameChanged, setNameChanged] = useState(false);
    const [date, setDate] = useState(new Date());
    const [defaultName, setDefaultName] = useState('');
    const router = useRouter();
    const { getTemplateById, getCategoryTree, createTransaction, updateTemplate } = useApi();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (templateId == null || !isFocused) return;
        let isMounted = true;
        setIsLoading(true);

        (async () => {
            try {
                const [fetchedTemplate, fetchedTree] = await Promise.all([
                    getTemplateById(templateId),
                    getCategoryTree(),
                ]);
                if (!isMounted) return;

                setTemplate(fetchedTemplate ?? null);
                setCategoryTree(Array.isArray(fetchedTree) ? fetchedTree : []);
                setNameChanged(false);

                const { nodes } = buildTemplateCategoryTree(
                    Array.isArray(fetchedTree) ? fetchedTree : [],
                    fetchedTemplate?.templateTransactions ?? []
                );
                setExpandedIds(getDefaultExpandedCategoryIds(nodes));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [templateId, isFocused]);

    const { nodes, orphanedTransactions } = useMemo(
        () => buildTemplateCategoryTree(categoryTree, template?.templateTransactions ?? []),
        [categoryTree, template?.templateTransactions]
    );

    const totalSum = useMemo(() => {
        const transactions = template?.templateTransactions ?? [];
        return transactions.reduce((sum, tx) => sum + tx.value, 0);
    }, [template?.templateTransactions]);

    const transactionCount = template?.templateTransactions?.length ?? 0;

    const toggleCategory = (categoryId: number) => {
        setExpandedIds((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const collapseAll = () => {
        setExpandedIds({});
    };

    const expandWithTransactions = () => {
        setExpandedIds(getDefaultExpandedCategoryIds(nodes));
    };

    const executeTemplate = async () => {
        if (!template || template.templateTransactions.length === 0 || isExecuting) return;
        setIsExecuting(true);
        try {
            await Promise.all(
                template.templateTransactions.map((tx) => {
                    const executionDate = getExecutionDate(date, tx.dateOffset);
                    return createTransaction({
                        name: tx.name ? tx.name : defaultName,
                        value: tx.value,
                        detail: tx.detail,
                        date: executionDate,
                        categoryId: tx.categoryId,
                    } as Transaction);
                })
            );
            alert('Template Executed', `${template.templateTransactions.length} transaction(s) created.`);
        } finally {
            setIsExecuting(false);
        }
    };

    const executeTemplateDialog = () => {
        if (!template || template.templateTransactions.length === 0) return;
        alert(
            'Execute Template?',
            `Do you want to create ${template.templateTransactions.length} transaction(s)?`,
            [
                { text: 'Cancel', style: 'cancel', onPress: () => {} },
                { text: 'OK', onPress: () => executeTemplate() },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.settingsCard}>
                    <Text style={styles.label}>Template Name</Text>
                    <View style={styles.nameRow}>
                        <TextInput
                            placeholder="Template Name"
                            placeholderTextColor={theme.colors.secondary_text}
                            style={[styles.input, styles.nameInput]}
                            blurOnSubmit
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={template?.name ?? ''}
                            onChangeText={(input) => {
                                if (!template) return;
                                setTemplate({ ...template, name: input });
                                setNameChanged(true);
                            }}
                        />
                        {nameChanged && (
                            <TouchableOpacity
                                style={styles.saveNameButton}
                                onPress={async () => {
                                    if (!template) return;
                                    await updateTemplate(template);
                                    setNameChanged(false);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="content-save"
                                    size={22}
                                    color={theme.colors.primary_text}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.label}>Date</Text>
                    <DatePicker
                        style={styles.dateInput}
                        date={date}
                        setDate={setDate}
                        setTime={false}
                    />

                    <Text style={styles.label}>Default Name</Text>
                    <TextInput
                        placeholder="Default Name"
                        placeholderTextColor={theme.colors.secondary_text}
                        style={styles.input}
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={defaultName}
                        onChangeText={setDefaultName}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Transactions ({transactionCount})
                    </Text>
                    <Text
                        style={[
                            styles.totalValue,
                            {
                                color:
                                    totalSum > 0
                                        ? theme.colors.positive_text
                                        : totalSum < 0
                                          ? theme.colors.negative_text
                                          : theme.colors.secondary_text,
                            },
                        ]}
                    >
                        {totalSum.toFixed(2)} {CURRENCY_SYMBOL}
                    </Text>
                </View>

                {!isLoading && nodes.length > 0 && (
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            activeOpacity={0.7}
                            onPress={collapseAll}
                        >
                            <MaterialCommunityIcons
                                name="arrow-collapse-vertical"
                                size={16}
                                color={theme.colors.secondary_text}
                            />
                            <Text style={styles.quickActionText}>Collapse all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            activeOpacity={0.7}
                            onPress={expandWithTransactions}
                        >
                            <MaterialCommunityIcons
                                name="arrow-expand-vertical"
                                size={16}
                                color={theme.colors.accent}
                            />
                            <Text style={[styles.quickActionText, { color: theme.colors.accent }]}>
                                Expand with transactions
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.quickActionButton,
                                hideEmptyCategories && styles.quickActionButtonActive,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setHideEmptyCategories((prev) => !prev)}
                        >
                            <MaterialCommunityIcons
                                name={hideEmptyCategories ? 'eye-off-outline' : 'eye-outline'}
                                size={16}
                                color={
                                    hideEmptyCategories
                                        ? theme.colors.accent
                                        : theme.colors.secondary_text
                                }
                            />
                            <Text
                                style={[
                                    styles.quickActionText,
                                    hideEmptyCategories && { color: theme.colors.accent },
                                ]}
                            >
                                Hide empty
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.accent} />
                    </View>
                ) : (
                    <TemplateCategoryTree
                        nodes={nodes}
                        orphanedTransactions={orphanedTransactions}
                        baseDate={date}
                        defaultName={defaultName}
                        expandedIds={expandedIds}
                        hideEmptyCategories={hideEmptyCategories}
                        onToggleCategory={toggleCategory}
                        onPressTransaction={(transactionId) => {
                            router.navigate(
                                `templates/${templateId}/transaction/${transactionId}/edit`
                            );
                        }}
                    />
                )}
            </ScrollView>

            <View style={styles.transBarLeft}>
                <TouchableOpacity
                    style={styles.transButton}
                    onPress={() => {
                        router.navigate(`templates/${templateId}/transaction/create`);
                    }}
                >
                    <MaterialCommunityIcons
                        name="book-plus"
                        size={theme.fontSize.xlarge}
                        color="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.transButton,
                        (transactionCount === 0 || isExecuting) && styles.transButtonDisabled,
                    ]}
                    disabled={transactionCount === 0 || isExecuting}
                    onPress={executeTemplateDialog}
                >
                    <MaterialCommunityIcons
                        name="clipboard-text-play-outline"
                        size={theme.fontSize.xlarge}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 110,
    },
    settingsCard: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 15,
        padding: 15,
        marginBottom: 18,
    },
    label: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        marginBottom: 6,
        marginTop: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameInput: {
        flex: 1,
    },
    saveNameButton: {
        backgroundColor: theme.colors.accent,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: theme.colors.backgroundTertiary,
        color: theme.colors.primary_text,
        borderRadius: 10,
        padding: 10,
    },
    dateInput: {
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: 10,
        padding: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        color: theme.colors.primary_text,
        fontSize: theme.fontSize.regular,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: theme.fontSize.regular,
        fontFamily: 'JetBrainsMono',
        fontWeight: 'bold',
    },
    quickActionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    quickActionButtonActive: {
        borderColor: theme.colors.accent,
    },
    quickActionText: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        fontWeight: '600',
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    transBarLeft: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        flexDirection: 'row',
        gap: 15,
    },
    transButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
    },
    transButtonDisabled: {
        opacity: 0.5,
    },
});

export default TemplateDetailScreen;
