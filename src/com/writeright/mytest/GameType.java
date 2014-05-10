package com.writeright.mytest;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "GameType")
public class GameType {
	
	public GameType() {
		super();
	}
	
	
	public GameType(String name) {
		super();
		this.name = name;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	String name;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "gameType")
	private List<GameLevel> gameLevels;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<GameLevel> getGameLevels() {
		return gameLevels;
	}	

}
