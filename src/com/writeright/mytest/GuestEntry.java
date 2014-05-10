package com.writeright.mytest;

import javax.persistence.*;

@Entity
@Table(name = "GuestEntry")
public class GuestEntry {
	  private Long id;
	  private String message;

	  public GuestEntry() {};

	  public GuestEntry(String message) {
	    this.message = message;
	  }

	  @Id
	  @GeneratedValue(strategy = GenerationType.SEQUENCE)
	  public Long getId() {
	    return id;
	  }

	  private void setId(Long id) {
	    this.id = id;
	  }
	  public String getMessage() {
	    return message;
	  }

	  public void setMessage(String message) {
	    this.message = message;
	  }
}
