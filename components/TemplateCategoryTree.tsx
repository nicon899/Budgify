import theme, { CURRENCY_SYMBOL } from '@/app/theme';
import { Category } from '@/types/Category';
import { TemplateTransaction } from '@/types/TemplateTransaction';
import { getDateText } from '@/util/util';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type CategoryTreeNode = {
    category: Category;
    directTransactions: TemplateTransaction[];
    children: CategoryTreeNode[];
    subtotal: number;
    transactionCount: number;
};

/**
 * Computes the execution date for a template transaction by applying its day offset to the base date.
 */
export const getExecutionDate = (baseDate: Date, dateOffset?: number): Date => {
    const result = new Date(baseDate);
    if (dateOffset != null && dateOffset !== 0) {
        result.setDate(result.getDate() + dateOffset);
    }
    return result;
};

/**
 * Builds a category hierarchy tree enriched with direct template transactions and recursive subtotals.
 */
export const buildTemplateCategoryTree = (
    categories: Category[],
    transactions: TemplateTransaction[]
): { nodes: CategoryTreeNode[]; orphanedTransactions: TemplateTransaction[] } => {
    const txByCategoryId = new Map<number, TemplateTransaction[]>();
    for (const tx of transactions) {
        const list = txByCategoryId.get(tx.categoryId) ?? [];
        list.push(tx);
        txByCategoryId.set(tx.categoryId, list);
    }

    const seenCategoryIds = new Set<number>();

    const buildNode = (category: Category): CategoryTreeNode => {
        if (typeof category.id === 'number') {
            seenCategoryIds.add(category.id);
        }
        const directTransactions =
            typeof category.id === 'number' ? txByCategoryId.get(category.id) ?? [] : [];
        const childNodes = (category.children ?? []).map(buildNode);
        const directSum = directTransactions.reduce((sum, tx) => sum + tx.value, 0);
        const childrenSum = childNodes.reduce((sum, child) => sum + child.subtotal, 0);
        const transactionCount =
            directTransactions.length +
            childNodes.reduce((sum, child) => sum + child.transactionCount, 0);

        return {
            category,
            directTransactions,
            children: childNodes,
            subtotal: directSum + childrenSum,
            transactionCount,
        };
    };

    const nodes = categories.map(buildNode);
    const orphanedTransactions = transactions.filter((tx) => !seenCategoryIds.has(tx.categoryId));

    return { nodes, orphanedTransactions };
};

/**
 * Returns the initial expanded map where categories containing template transactions
 * (directly or in any subcategory) are expanded and all others are collapsed.
 */
export const getDefaultExpandedCategoryIds = (
    nodes: CategoryTreeNode[]
): Record<number, boolean> => {
    const expanded: Record<number, boolean> = {};

    const visit = (node: CategoryTreeNode) => {
        if (typeof node.category.id === 'number' && node.transactionCount > 0) {
            expanded[node.category.id] = true;
        }
        for (const child of node.children) {
            visit(child);
        }
    };

    for (const node of nodes) {
        visit(node);
    }

    return expanded;
};

/**
 * Recursively filters out category nodes that contain no template transactions in their subtree.
 */
export const filterNonEmptyCategoryNodes = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
    return nodes
        .filter((node) => node.transactionCount > 0)
        .map((node) => ({
            ...node,
            children: filterNonEmptyCategoryNodes(node.children),
        }));
};

const getAmountColor = (value: number): string => {
    if (value > 0) return theme.colors.positive_text;
    if (value < 0) return theme.colors.negative_text;
    return theme.colors.secondary_text;
};

const formatAmount = (value: number): string => {
    const rounded = (Math.round(value * 100 + Number.EPSILON) / 100).toFixed(2);
    return `${rounded} ${CURRENCY_SYMBOL}`;
};

type CategoryNodeViewProps = {
    node: CategoryTreeNode;
    depth: number;
    baseDate: Date;
    defaultName: string;
    expandedIds: Record<number, boolean>;
    onToggleCategory: (categoryId: number) => void;
    onPressTransaction: (transactionId: number) => void;
};

const CategoryNodeView: React.FC<CategoryNodeViewProps> = ({
    node,
    depth,
    baseDate,
    defaultName,
    expandedIds,
    onToggleCategory,
    onPressTransaction,
}) => {
    const categoryId = typeof node.category.id === 'number' ? node.category.id : -1;
    const isExpanded = Boolean(expandedIds[categoryId]);
    const isRoot = depth === 0;

    return (
        <View style={isRoot ? styles.rootCard : styles.childWrapper}>
            <TouchableOpacity
                style={[styles.categoryHeader, isRoot ? styles.rootHeader : styles.childHeader]}
                activeOpacity={0.7}
                onPress={() => {
                    if (categoryId !== -1) {
                        onToggleCategory(categoryId);
                    }
                }}
            >
                <View style={styles.categoryLeft}>
                    <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-down' : 'chevron-right'}
                        size={20}
                        color={theme.colors.secondary_text}
                    />
                    <Text
                        numberOfLines={1}
                        style={[styles.categoryName, isRoot ? styles.rootName : styles.childName]}
                    >
                        {node.category.name}
                    </Text>
                    {node.transactionCount > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{node.transactionCount}</Text>
                        </View>
                    )}
                </View>

                <Text
                    numberOfLines={1}
                    style={[styles.subtotalText, { color: getAmountColor(node.subtotal) }]}
                >
                    {formatAmount(node.subtotal)}
                </Text>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.expandedContent}>
                    {node.directTransactions.map((tx) => {
                        const executionDate = getExecutionDate(baseDate, tx.dateOffset);
                        const displayName = tx.name?.trim()
                            ? tx.name
                            : defaultName?.trim()
                              ? defaultName
                              : 'Unnamed';
                        const offsetLabel =
                            tx.dateOffset != null && tx.dateOffset !== 0
                                ? ` (${tx.dateOffset > 0 ? `+${tx.dateOffset}` : tx.dateOffset}d)`
                                : '';

                        return (
                            <TouchableOpacity
                                key={tx.id}
                                style={styles.transactionRow}
                                activeOpacity={0.7}
                                onPress={() => onPressTransaction(tx.id)}
                            >
                                <View style={styles.transactionInfo}>
                                    <Text numberOfLines={1} style={styles.transactionName}>
                                        {displayName}
                                    </Text>
                                    <Text numberOfLines={1} style={styles.transactionDate}>
                                        {getDateText(executionDate)}
                                        {offsetLabel}
                                    </Text>
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.transactionValue,
                                        { color: getAmountColor(tx.value) },
                                    ]}
                                >
                                    {formatAmount(tx.value)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    {node.children.map((childNode) => (
                        <CategoryNodeView
                            key={String(childNode.category.id)}
                            node={childNode}
                            depth={depth + 1}
                            baseDate={baseDate}
                            defaultName={defaultName}
                            expandedIds={expandedIds}
                            onToggleCategory={onToggleCategory}
                            onPressTransaction={onPressTransaction}
                        />
                    ))}

                    {node.directTransactions.length === 0 && node.children.length === 0 && (
                        <Text style={styles.emptyCategoryText}>No transactions</Text>
                    )}
                </View>
            )}
        </View>
    );
};

type TemplateCategoryTreeProps = {
    nodes: CategoryTreeNode[];
    orphanedTransactions?: TemplateTransaction[];
    baseDate: Date;
    defaultName: string;
    expandedIds: Record<number, boolean>;
    hideEmptyCategories?: boolean;
    onToggleCategory: (categoryId: number) => void;
    onPressTransaction: (transactionId: number) => void;
};

const TemplateCategoryTree: React.FC<TemplateCategoryTreeProps> = ({
    nodes,
    orphanedTransactions = [],
    baseDate,
    defaultName,
    expandedIds,
    hideEmptyCategories = false,
    onToggleCategory,
    onPressTransaction,
}) => {
    const visibleNodes = hideEmptyCategories ? filterNonEmptyCategoryNodes(nodes) : nodes;

    if (visibleNodes.length === 0 && orphanedTransactions.length === 0) {
        return (
            <Text style={styles.emptyTreeText}>
                {hideEmptyCategories ? 'No categories with transactions.' : 'No categories found.'}
            </Text>
        );
    }

    const orphanSubtotal = orphanedTransactions.reduce((sum, tx) => sum + tx.value, 0);

    return (
        <View style={styles.container}>
            {visibleNodes.map((node) => (
                <CategoryNodeView
                    key={String(node.category.id)}
                    node={node}
                    depth={0}
                    baseDate={baseDate}
                    defaultName={defaultName}
                    expandedIds={expandedIds}
                    onToggleCategory={onToggleCategory}
                    onPressTransaction={onPressTransaction}
                />
            ))}

            {orphanedTransactions.length > 0 && (
                <View style={styles.rootCard}>
                    <View style={[styles.categoryHeader, styles.rootHeader]}>
                        <View style={styles.categoryLeft}>
                            <MaterialCommunityIcons
                                name="help-circle-outline"
                                size={20}
                                color={theme.colors.secondary_text}
                            />
                            <Text numberOfLines={1} style={[styles.categoryName, styles.rootName]}>
                                Uncategorized
                            </Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>
                                    {orphanedTransactions.length}
                                </Text>
                            </View>
                        </View>
                        <Text
                            numberOfLines={1}
                            style={[styles.subtotalText, { color: getAmountColor(orphanSubtotal) }]}
                        >
                            {formatAmount(orphanSubtotal)}
                        </Text>
                    </View>
                    <View style={styles.expandedContent}>
                        {orphanedTransactions.map((tx) => {
                            const executionDate = getExecutionDate(baseDate, tx.dateOffset);
                            const displayName = tx.name?.trim()
                                ? tx.name
                                : defaultName?.trim()
                                  ? defaultName
                                  : 'Unnamed';
                            return (
                                <TouchableOpacity
                                    key={tx.id}
                                    style={styles.transactionRow}
                                    activeOpacity={0.7}
                                    onPress={() => onPressTransaction(tx.id)}
                                >
                                    <View style={styles.transactionInfo}>
                                        <Text numberOfLines={1} style={styles.transactionName}>
                                            {displayName}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.transactionDate}>
                                            {getDateText(executionDate)}
                                        </Text>
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.transactionValue,
                                            { color: getAmountColor(tx.value) },
                                        ]}
                                    >
                                        {formatAmount(tx.value)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
    },
    rootCard: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 12,
        overflow: 'hidden',
    },
    childWrapper: {
        marginTop: 6,
        borderLeftWidth: 1,
        borderLeftColor: '#2E323A',
        paddingLeft: 8,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    rootHeader: {
        paddingVertical: 12,
    },
    childHeader: {
        paddingVertical: 8,
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: 8,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 6,
        marginRight: 8,
    },
    categoryName: {
        color: theme.colors.primary_text,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    rootName: {
        fontSize: theme.fontSize.regular,
    },
    childName: {
        fontSize: 15,
    },
    countBadge: {
        backgroundColor: '#2A2E35',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 1,
    },
    countBadgeText: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        fontWeight: 'bold',
    },
    subtotalText: {
        fontSize: 15,
        fontFamily: 'JetBrainsMono',
        fontWeight: 'bold',
    },
    expandedContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 6,
    },
    transactionInfo: {
        flex: 1,
        marginRight: 10,
    },
    transactionName: {
        color: theme.colors.primary_text,
        fontSize: 15,
        fontWeight: '600',
    },
    transactionDate: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        marginTop: 2,
    },
    transactionValue: {
        fontSize: 15,
        fontFamily: 'JetBrainsMono',
    },
    emptyCategoryText: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        fontStyle: 'italic',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    emptyTreeText: {
        color: theme.colors.secondary_text,
        fontSize: theme.fontSize.small,
        textAlign: 'center',
        paddingVertical: 20,
    },
});

export default TemplateCategoryTree;
