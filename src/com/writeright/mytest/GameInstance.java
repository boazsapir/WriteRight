package com.writeright.mytest;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "GameInstance")
public class GameInstance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="student",referencedColumnName="id")
	Student student;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "gameInstance")
	 private List<GameTaskInstance> gameTaskInstances = new ArrayList<GameTaskInstance>();

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public int getId() {
		return id;
	}

	public List<GameTaskInstance> getGameTaskInstances() {
		return gameTaskInstances;
	}	

}
