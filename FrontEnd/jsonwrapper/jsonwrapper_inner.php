<?php

require_once 'JSON/JSON.php';

function json_encode($arg)
{
	global $services_json;
	if (!isset($services_json)) {
		$services_json = new Services_JSON();
	}
	// hack to implement JSONP requests
	if(!isset($_REQUEST['jsonp'])){
		return $services_json->encode($arg);
	} else {
		return $_REQUEST['jsonp']."(".$services_json->encode($arg).")";
	}
}

function json_decode($arg)
{
	global $services_json;
	if (!isset($services_json)) {
		$services_json = new Services_JSON();
	}
	return $services_json->decode($arg);
}

?>
