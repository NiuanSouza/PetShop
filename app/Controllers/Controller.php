<?php

namespace App\Controllers;


class Controller
{

    public function index()
    {
        require('../app/Views/navbar.php');
        require('../app/Views/index.php');
    }
}
