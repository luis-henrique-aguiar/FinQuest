package br.edu.ifsp.prsi.finquest.dto;

import java.util.List;

public record ExpensesReportDTO(
        List<ExpenseInfoDTO> expenses
) {
}
