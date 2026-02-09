import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    type Transaction,
    type TransactionType,
    type CreateTransactionDTO,
    type UpdateTransactionDTO,
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
} from '@/features/finance/services/transaction-api';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        data: CreateTransactionDTO | UpdateTransactionDTO
    ) => Promise<void>;
    initialData?: Transaction | null;
    isLoading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<{
        type: TransactionType;
        amount: string;
        description: string;
        category: string;
        date: string;
        notes: string;
    }>({
        type: 'EXPENSE',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    type: initialData.type,
                    amount: String(initialData.amount),
                    description: initialData.description,
                    category: initialData.category,
                    date: initialData.date,
                    notes: initialData.notes || '',
                });
            } else {
                setFormData({
                    type: 'EXPENSE',
                    amount: '',
                    description: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0],
                    notes: '',
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: CreateTransactionDTO | UpdateTransactionDTO = {
            type: formData.type,
            amount: Number(formData.amount),
            description: formData.description,
            category: formData.category,
            date: formData.date,
            notes: formData.notes || undefined,
        };

        await onSubmit(data);
    };

    const handleTypeChange = (newType: string) => {
        setFormData({
            ...formData,
            type: newType as TransactionType,
            category: '',
        });
    };

    const availableCategories =
        formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Edite as informações da transação abaixo.'
                            : 'Preencha os dados para registrar uma nova transação.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={handleTypeChange}
                                disabled={isLoading}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EXPENSE">💸 Despesa</SelectItem>
                                    <SelectItem value="INCOME">💰 Receita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                }
                                placeholder="0,00"
                                min="0"
                                step="0.01"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Ex: Supermercado, Salário, Conta de luz..."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                disabled={isLoading}
                                required
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="notes">Observações (opcional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            placeholder="Alguma observação adicional..."
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? 'Salvando...'
                                : initialData
                                    ? 'Salvar Alterações'
                                    : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
