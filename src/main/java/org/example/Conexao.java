package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {
    private static final String URL = "jdbc:mysql://localhost:3306/cantina_senai_db"
            + " ?useSSL = false"
            + "&allowPublicKeyRetriveal = true"
            + "&serverTimezone = America/Sao_Paulo";
    // permite que o  drive JDBC  solicite ao MySQL uma chave publica durante a autenticacao
    private static final String USUARIO = "cantina";
    private static  final  String SENHA = "cantina123";

    private Conexao(){}

    public static Connection contectar () throws SQLException {
        return DriverManager.getConnection(URL, USUARIO, SENHA);

    }

    public static void testar() throws SQLException{
        try (Connection conexao = contectar()){
        if (!conexao .isValid(2)){
            throw new SQLException(" O MySQL nao confirmou a conexao !!!");
        }

        }
    }




}
