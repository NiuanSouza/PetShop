<?php

namespace Core;

use PDO;

class Database extends PDO
{
    public function __construct()
    {
        parent::__construct(
            "mysql:hostname=localhost;dbname=users",
            "root",
            "root"
        );
    }
}
