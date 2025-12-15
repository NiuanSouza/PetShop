<?php

namespace App\Models;

class Pet
{
    public $Id_Pet;
    public $Nome_Pet;
    public $Raca = new Raca;
    public $Pet_Peculiaridade;
    public $Pet_foto;
    public $Dono_Pet;
    public $Dono_Contato;

    function __construct($pet = null, $nome = null, $Raca = new Raca(), $peculiaridade = null, $foto = null, $dono = null, $contato = null)
    {
        $this->Id_Pet = $pet;
        $this->Nome_Pet = $nome;
        if ($Raca != null) {
            $this->Raca = $Raca;
        } else {
            $this->Raca = null;
        }

        $this->Pet_Peculiaridade = $peculiaridade;
        $this->Pet_foto = $foto;
        $this->Dono_Pet = $dono;
        $this->Dono_Contato = $contato;
    }
}
