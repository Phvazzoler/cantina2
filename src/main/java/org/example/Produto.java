package org.example;

public class Produto {
    private int id;
    private String nome ;
    private String categoria;
    private String descricao;
    private double preco;
    private String emoji;

    public Produto(){}

    public Produto(int id, String nome, String categoria, String descricao, double preco, String emoji) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.descricao = descricao;
        this.preco = preco;
        this.emoji = emoji;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public double getPreco() {
        return preco;
    }

    public String getEmoji() {
        return emoji;
    }



}
