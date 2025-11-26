package br.edu.ifsp.prsi.finquest.dto;

import java.math.BigDecimal;

public record MonthlyReportDTO(
        String month,
        BigDecimal receitas,
        BigDecimal despesas,
        BigDecimal saldo,
        long transactionCount
) {
    public static String[] months = {"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"};
}
