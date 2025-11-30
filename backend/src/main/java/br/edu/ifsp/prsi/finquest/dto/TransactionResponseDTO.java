package br.edu.ifsp.prsi.finquest.dto;

public record TransactionResponseDTO(
        TransactionDTO transaction,
        MissionCompletionDTO missionCompletion
) {}
