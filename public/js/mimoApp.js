/**
 * Created by vasujain on 11/6/13.
 */
function validateAppForm()
{
	var appName = document.forms["appForm"]["appName"].value;
	var appShortName = document.forms["appForm"]["appShortName"].value;
	if (appName == null || appName == "" || appShortName == null || appShortName == "") {
		alert("AppName/AppShortName can not be null");
		return false;
	}
	return true;
}

function validateUserForm()
{
	var userName = document.forms["userForm"]["userName"].value;
	var userEmail = document.forms["userForm"]["userEmail"].value;
	var userPwd1 = document.forms["userForm"]["userPwd1"].value;
	var userPwd2 = document.forms["userForm"]["userPwd2"].value;
	if (userName == null || userName == "" || userEmail == null || userEmail == "") {
		alert("UserName/UserEmail can not be null");
		return false;
	}
	if (userPwd1 == null || userPwd1 == "" || userPwd2 == null || userPwd2 == "") {
		alert("user Password can not be null");
		return false;
	}
	if (userPwd1 != userPwd2) {
		alert("user Pwd do not match");
		return false;
	}
	return true;
}

function validateRsrcForm()
{
	var rsrcPath = document.forms["rsrcForm"]["rsrcPath"].value;
	var rsrcBody = document.forms["rsrcForm"]["rsrcBody"].value;
	if (rsrcPath == null || rsrcPath == "" || rsrcBody == null || rsrcBody == "") {
		alert("ResourcePath/ResourceBody can not be null");
		return false;
	}
	return true;
}

$(document).ready(function ()
{

});