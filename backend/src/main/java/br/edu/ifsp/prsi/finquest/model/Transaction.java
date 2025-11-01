package br.edu.ifsp.prsi.finquest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Transaction {

    @Id
    private Long id;
}
