package org.example;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ProdutoDAO {

    public List<Produto> listarDisponiveis()
            throws SQLException {

        String sql = """
                SELECT id, nome, categoria, descricao, preco, emoji
                FROM produtos
                WHERE disponiveis = TRUE
                ORDER BY categoria, nome
                """;

        List<Produto> produtos = new ArrayList<>();

        try (
                Connection conexao = Conexao.conectar();

                PreparedStatement comando =
                        conexao.prepareStatement(sql);

                ResultSet resultado =
                        comando.executeQuery()
        ) {

            while (resultado.next()) {
                produtos.add(
                        criarProduto(resultado)
                );
            }
        }

        return produtos;
    }

    // Metodo para encontrar um produto ou retornar vazio.
    public Optional<Produto> buscarPorId(int id)
            throws SQLException {

        String sql = """
                SELECT id, nome, categoria, descricao, preco, emoji
                FROM produtos
                WHERE id = ?
                  AND disponiveis = TRUE
                """;

        try (
                Connection conexao = Conexao.conectar();

                PreparedStatement comando =
                        conexao.prepareStatement(sql)
        ) {

            comando.setInt(1, id);

            try (ResultSet resultado =
                         comando.executeQuery()) {

                if (resultado.next()) {
                    return Optional.of(
                            criarProduto(resultado)
                    );
                }
            }
        }

        return Optional.empty();
    }

    private Produto criarProduto(
            ResultSet resultado
    ) throws SQLException {

        return new Produto(
                resultado.getInt("id"),
                resultado.getString("nome"),
                resultado.getString("categoria"),
                resultado.getString("descricao"),
                resultado.getDouble("preco"),
                resultado.getString("emoji")
        );
    }
}
