<?php

namespace App\Models;

class Especie
{
    public $Id_Especie;
    public $Nome_Especie;

    function __construct($Especie = null, $Nome_Especie = null)
    {
        $this->Id_Especie = $Especie;
        $this->Nome_Especie = $Nome_Especie;
    }
}
