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
import javax.persistence.Table;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;

@Entity
@Table(name = "GameTaskInstance")public class GameTaskInstance {

	public GameTaskInstance() {
	
	}
	public GameTaskInstance(GameInstance gameInstance) {
		this.setGameInstance(gameInstance);
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private List<LetterSelection> wrongLetterSelections = new ArrayList<LetterSelection>();
	
	private int duration = 0;
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="gameTaskInstance",referencedColumnName="id")
	WordInLevel wordInLevel;
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="gameInstance",referencedColumnName="id")
	GameInstance gameInstance;

	public GameInstance getGameInstance() {
		return gameInstance;
	}

	public void setGameInstance(GameInstance gameInstance) {
		this.gameInstance = gameInstance;
	}

	public int getId() {
		return id;
	}

	public List<LetterSelection> getWrongLetterSelections() {
		return wrongLetterSelections;
	}

	public void setWrongLetterSelections(List<LetterSelection> wrongLetterSelections) {
		this.wrongLetterSelections = wrongLetterSelections;
	}
	
	
	public void clearLetterSelections(){
		this.wrongLetterSelections.clear();
	}
	public WordInLevel getWordInLevel() {
		return wordInLevel;
	}
	public void setWordInLevel(WordInLevel wordInLevel) {
		this.wordInLevel = wordInLevel;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	
}
