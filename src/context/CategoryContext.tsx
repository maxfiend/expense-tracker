import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getDefaultCategories } from '../utils/expenseUtils';

interface CategoryContextType {
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<string[]>(
        getDefaultCategories()
    );

    return (
        <CategoryContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategoryContext = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
};