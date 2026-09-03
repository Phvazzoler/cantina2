package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {

    private static final String URL =
            "jdbc:mysql://localhost:3306/cantina_senai_db"
                    + "?useSSL=false"
                    + "&allowPublicKeyRetrieval=true"
                    + "&serverTimezone=America/Sao_Paulo";

    // Permite que o driver JDBC solicite ao MySQL
    // uma chave pública durante a autenticação.

    private static final String USUARIO = "cantina";
    private static final String SENHA = "cantina123";

    private Conexao() {
    }

    public static Connection conectar() throws SQLException {
        return DriverManager.getConnection(
                URL,
                USUARIO,
                SENHA
        );
    }

    public static void testar() throws SQLException {

        try (Connection conexao = conectar()) {

            if (!conexao.isValid(2)) {
                throw new SQLException(
                        "O MySQL não confirmou a conexão!"
                );
            }
        }
    }
}
