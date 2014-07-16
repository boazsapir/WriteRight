package com.writeright.mytest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SendFeedback extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse res)throws ServletException, IOException{
		doGet(req, res);
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse res)throws ServletException, IOException 
	{       
		String userName = req.getParameter("name");
	 String userMessage = req.getParameter("message");
	 String userEmail = req.getParameter("email");
	 String msgBody = "Name: " + ((userName != null)?userName:"") + "\r\nEmail: " + ((userEmail != null)?userEmail:"") + "\r\n\nMessage:\r\n========\r\n" + ((userMessage != null)?userMessage:"");
	Properties props = new Properties();
	Session session = Session.getDefaultInstance(props, null);
//throw (new ServletException());

	try {
	    Message msg = new MimeMessage(session);
	    msg.setFrom(new InternetAddress("sapirboaz@gmail.com", "WriteRight Feedback"));
	    msg.addRecipient(Message.RecipientType.TO,
	     new InternetAddress("tuval@appy2write.com", "App Admin"));
	    msg.setSubject("New User Feedback");
	    msg.setText(msgBody);
	    Transport.send(msg);

	} catch (AddressException e) {
	    // ...
	} catch (MessagingException e) {
	    // ...
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}

	};
	
}
