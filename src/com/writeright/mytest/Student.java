package com.writeright.mytest;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;

@Entity
@Table(name = "Student")
public class Student {

	public Student(Student student) {
		super();
		this.firstName = student.firstName;
		this.lastName = student.lastName;
	}

	public Student() {
		// TODO Auto-generated constructor stub
	}

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String firstName;
	private String lastName;
	
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "student")
	 private List<GameInstance> gameInstances = new ArrayList<GameInstance>();

	public int getId() {
		return id;
	}

	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
	public List<GameInstance> getGameInstances() {
		return gameInstances;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}	
}
