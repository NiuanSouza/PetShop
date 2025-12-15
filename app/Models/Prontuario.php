<?php

namespace App\Models;

class Prontuario
{
    public $Id_Prontuario;
    public $Pet = new Pet;
    public $Data_Prontuario;
    public $Observacao;


    public function __construct($prontuario = null, $Pet = new Pet, $data = null, $obeservacao = null)
    {
        $this->Id_Prontuario = $prontuario;

        if ($Pet != null) {
            $this->Pet = $Pet;
        } else {
            $this->Pet = null;
        }

        $this->Data_Prontuario = $data;
        $this->Observacao = $obeservacao;
    }
}
