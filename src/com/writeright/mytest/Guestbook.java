package com.writeright.mytest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;

import javax.inject.Named;
import javax.persistence.*;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.api.utils.SystemProperty;

@Api(name = "guestbook",
	 version = "v1"
)
public class Guestbook {
	private static	   Map<String, String> properties; 
	private static	    EntityManagerFactory emf;

	static{
	    properties = new HashMap();
	    if (SystemProperty.environment.value() ==
	          SystemProperty.Environment.Value.Production) {
	      properties.put("javax.persistence.jdbc.driver",
	          "com.mysql.jdbc.GoogleDriver");
	      properties.put("javax.persistence.jdbc.url",
	          System.getProperty("cloudsql.url"));
	    } else {
	      properties.put("javax.persistence.jdbc.driver",
	          "com.mysql.jdbc.Driver");
	      properties.put("javax.persistence.jdbc.url",
	    		  System.getProperty("cloudsql.url.dev")
	          );
	    }

	    emf = Persistence.createEntityManagerFactory(
	        "Demo", properties);

}

	  public GuestEntry getEntry(@Named("id") Integer id) {
		  EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    String query = "SELECT g FROM GuestEntry g WHERE g.id=" + id;
		    List<GuestEntry> result = em
		        .createQuery(query)
		        .getResultList();

		    em.getTransaction().commit();
		    em.close();
		    return result.get(0);
	  }
	  public List<GuestEntry> getAllEntries() {
		  EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    List<GuestEntry> result = em
		        .createQuery("SELECT g FROM GuestEntry g")
		        .getResultList();

		    em.getTransaction().commit();
		    em.close();
		    return result;
	  }
	  
	  @ApiMethod(name = "greetings.insert", httpMethod = "post")
	  public void insertEntry(GuestEntry entry) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(new GuestEntry(entry.getMessage()));
		    em.getTransaction().commit();
		    em.close();
	  }
	  
}
