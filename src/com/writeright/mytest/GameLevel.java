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

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;

@Entity
@Table(name = "GameLevel")
public class GameLevel {

	public GameLevel() {
		super();
	}
	
	public GameLevel(GameLevel gameLevelObj){
		super();
		this.levelIndex = gameLevelObj.levelIndex;
		this.letterNumToComplete = gameLevelObj.letterNumToComplete;
		this.gameType = gameLevelObj.gameType;	}
	
	public GameLevel(int levelIndex, int letterNumToComplete, GameType gameType) {
		super();
		this.levelIndex = levelIndex;
		this.letterNumToComplete = letterNumToComplete;
		this.gameType = gameType;
	}
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	int levelIndex;
	int letterNumToComplete; // -1 for last letter
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "gameLevel")
	 private List<WordInLevel> wordsInLevel = new ArrayList<WordInLevel>();	
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="gameType",referencedColumnName="id")
	private GameType gameType;

	public int getLevelIndex() {
		return levelIndex;
	}

	public void setLevelIndex(int levelIndex) {
		this.levelIndex = levelIndex;
	}

	public int getLetterNumToComplete() {
		return letterNumToComplete;
	}

	public void setLetterNumToComplete(int letterNumToComplete) {
		this.letterNumToComplete = letterNumToComplete;
	}

	public void setGameTypeName(GameType gameType){
		this.gameType = gameType;
	}
	
	public String getGameTypeName(){
		return this.gameType.getName();
	}
	public GameType getGameType() {
		return gameType;
	}

	public void setGameType(GameType gameType) {
		this.gameType = gameType;
	}
	
	public List<Word> getWords(){
		List<Word> retVal = new ArrayList<Word>();
		for(int i=0; i<wordsInLevel.size();i++){
			retVal.add(wordsInLevel.get(i).getWord());
		}
		return retVal;
	}
	public List<WordInLevel> getWordsInLevel(){

		return wordsInLevel;
	}
}
