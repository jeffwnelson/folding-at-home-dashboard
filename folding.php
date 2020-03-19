<?php

/*
 * This file is called on a cron.
 * Data is saved to JSON files and Log files
 */

// Remove PHP version
header_remove('X-Powered-By');

// Configure a few things
date_default_timezone_set('America/Chicago');
$file = "folding-data.json";
$logfile = "folding-data.log";
$lastsuccess = "last.log";
$failures = "failures.log";
$timestamp = date("M d Y h:i:s A");

// Set HTTP header
$headers = array(
  'Content-Type: application/json',
);

// URL to query
$url = 'https://stats.foldingathome.org/api/team/237887';

// Open connection
$ch = curl_init();

// Set the url, number of GET vars, GET data
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Execute request
$result = curl_exec($ch);

// Grab HTTP response code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// If we get a 200, we got some data, save it.
// anything, log the attempt and close
if ($httpCode == 200) {
  file_put_contents($file, $result);
  file_put_contents($lastsuccess, $timestamp);
  file_put_contents($failures, 0);
  $logstatus = "Stats pulled successfully. Updating.";
} else {
  $count = (int)file_get_contents($failures);
  $count++;
  file_put_contents($failures, $count);
  $logstatus = "Could not pull stats from F@H. No changes.";
}

// Write our log
file_put_contents($logfile, $timestamp.' | '.$logstatus."\n", FILE_APPEND);

// Close connection
curl_close($ch);