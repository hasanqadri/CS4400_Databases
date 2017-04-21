<?php
# In PHP 5.2 or higher we don't need to bring this in
if (!function_exists('json_encode')) {
	require_once 'jsonwrapper_inner.php';
} 
function jsonp_encode($object, $callback){
	if(is_null($callback) AND isset($_REQUEST['jsonp'])){
		$callback = $_REQUEST['jsonp'];
	} else if (is_null($callback)){
		return json_encode($object);
	}
	return $callback . '(' . json_encode($object) . ')';
}
?>

