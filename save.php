<?php

  //Vajadusel siia andmebaasi päring

  $file_name = "data.txt";

  $entries_from_file = file_get_contents($file_name);

  // Lõpp

  //Massiiv olemasolevate purkidega
  $entries = json_decode($entries_from_file);

  if(isset($_GET["id"]) && isset($_GET["title"]) && isset($_GET["ingredients"]) && isset($_GET["date"]) && !empty($_GET["id"]) && !empty($_GET["title"]) && !empty($_GET["ingredients"]) && !empty($_GET["date"])) {

    // Salvestan juurde
    $object = new StdClass();
    $object->id = $_GET["id"];
    $object->title = $_GET["title"];
    $object->ingredients = $_GET["ingredients"];
    $object->date = $_GET["date"];

    // Lisan massiivi juurde
    array_push($entries, $object);

    //Teen stringiks
    $json = json_encode($entries);

    //Salvestan faili
    file_put_contents($file_name, $json);

  }

  //var_dump($entries);
  echo(json_encode($entries));
?>
