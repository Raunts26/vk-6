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
    $object->deleted = NULL;

    // Lisan massiivi juurde
    array_push($entries, $object);

    //Teen stringiks
    //$json = json_encode($entries);

    $json = json_encode($entries);


    //Salvestan faili
    file_put_contents($file_name, $json);

  } elseif(isset($_GET["delete"]) && !empty($_GET["delete"])) {
    $object = new StdClass();

    for($i = 0; $i < count($entries); $i++) {
      if($entries[$i]->id == $_GET["delete"]) {
        $entries[$i]->deleted = 1;
      }
    }
    // Lisan massiivi juurde
    //array_push($entries, $object);

    //Teen stringiks
    //$json = json_encode($entries);



    $json = json_encode($entries);

    //Salvestan faili
    file_put_contents($file_name, $json);

  }

  $new_array = array();
  foreach ($entries as $i => $e) {
    if($e->deleted == NULL) {
      array_push($new_array, $e);
    }
  }

  echo(json_encode($new_array));


?>
