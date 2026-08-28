package org.example;

public class Pedido {

    private int id;
    private String codigo;
    private String matricula ;
    private String nomeAluno;
    private String periodo;
    private int produtoId;
    private int quantidade;
    private String produtoNome;
    private  double valorDigital;
    private double valorOrignal;
    private double percentualDescoto;
    private double  getValorFinal;
    private String status;


    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public int getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(int produtoId) {
        this.produtoId = produtoId;
    }

    public String getProdutoNome() {
        return produtoNome;
    }

    public void setProdutoNome(String produtoNome) {
        this.produtoNome = produtoNome;
    }

    public double getValorDigital() {
        return valorDigital;
    }

    public void setValorDigital(double valorDigital) {
        this.valorDigital = valorDigital;
    }

    public double getValorOrignal() {
        return valorOrignal;
    }

    public void setValorOrignal(double valorOrignal) {
        this.valorOrignal = valorOrignal;
    }

    public double getPercentualDescoto() {
        return percentualDescoto;
    }

    public void setPercentualDescoto(double percentualDescoto) {
        this.percentualDescoto = percentualDescoto;
    }

    public double getGetValorFinal() {
        return getValorFinal;
    }

    public void setGetValorFina(double getValorFina) {
        this.getValorFinal = getValorFina;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
