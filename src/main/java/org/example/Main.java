package org.example;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.util.Set;

public class Main {

    private  static final int PORTA =  8080;
    private  static final Gson GSON = new Gson();
    private  static final PedidoDAO PEDIDO_DAO = new PedidoDAO();
    private  static final ProdutoDAO PRODUTO_DAO = new ProdutoDAO();
    private  static final Set<String> PEDIDOS = Set.of(
      "Manhã", "Tarde ", "Noite"
    );
    //Set.of: conjuto de valores sem repetiçao
        public static void main(String[] args) {
            Conexao.testar();
            HttpServer servidor= HttpServer.create(new InetSocketAddress(PORTA), 0 );
            servidor.createContext("/api/cardapio", Main::tratarCardapio);

            servidor.createContext("/api/pedidos", Main::tratarPedido);

            Path pastaFrontend  =  Path.of("src/main/resources/static")
            .toAbsolutePath()// trasforma o caminho relativo em endereços completos
            .normalize();// limpa o enderço, removendo partes desnecessarias.  ex: . e ...












    }

}