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
	
	private int gameId;
	private int letterNumToComplete;
	private boolean pronounceLetters;
	private boolean highlightLetters;
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="wordInLevel",referencedColumnName="id")
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
	public int getGameId() {
		return gameId;
	}
	public void setGameId(int gameId) {
		this.gameId = gameId;
	}
	public int getLetterNumToComplete() {
		return letterNumToComplete;
	}
	public void setLetterNumToComplete(int letterNumToComplete) {
		this.letterNumToComplete = letterNumToComplete;
	}
	public boolean isPronounceLetters() {
		return pronounceLetters;
	}
	public void setPronounceLetters(boolean pronounceLetters) {
		this.pronounceLetters = pronounceLetters;
	}
	public boolean isHighlightLetters() {
		return highlightLetters;
	}
	public void setHighlightLetters(boolean highlightLetters) {
		this.highlightLetters = highlightLetters;
	}
	
}
