<?php
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST);//приймає дані перетворює в рядок і відправляє назад на клієнт respons який буде приходити з сервера