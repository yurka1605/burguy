<?php

	$c = true;
	$project_name = 'Заявка с сайта "Буржуй"';
	$admin_email  = "zakaz@jerki.ru";

	// zakaz@jerki.ru
	$form_subject = "Заявка на покупку";

	foreach ( $_POST as $key => $value ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
	}

	$message = "<table style='width: 100%;'>$message</table>";


	// mail(
	// 	$admin_email,
	// 	$form_subject,
	// 	$message,
	// 	"From: $project_name <$admin_email>" . "\r\n" . "Reply-To: $admin_email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\""
	// );




		$headers  = "From: noreply < noreply@".$_SERVER["HTTP_HOST"]." >\n";
	    $headers .= "Cc: noreply < noreply@".$_SERVER["HTTP_HOST"]." >\n";
	    $headers .= "X-Sender: noreply < noreply@".$_SERVER["HTTP_HOST"]." >\n";
	    $headers .= 'X-Mailer: PHP/' . phpversion();
	    $headers .= "X-Priority: 1\n";
	    $headers .= "Return-Path: noreply@".$_SERVER["HTTP_HOST"]."\n";
	    $headers .= "MIME-Version: 1.0\r\n";
	    $headers .= "Content-Type: text/html; charset=utf-8\n";
		mail($admin_email, 'Заявка с сайта '.$_SERVER["HTTP_HOST"], $message, $headers);
?>