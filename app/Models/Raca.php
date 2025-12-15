<?php

namespace App\Models;

class Raca
{
    public $Id_Raca;
    public $Especie = new Especie;
    public $Nome_Raca;

    function __construct($Raca = null, $Especie = new Especie(), $nome = null)
    {
        $this->Id_Raca = $Raca;
        if ($Especie != null) {
            $this->Especie = $Especie;
        } else {
            $this->Especie = null;
        }

        $this->Nome_Raca = $Raca;
    }
}
