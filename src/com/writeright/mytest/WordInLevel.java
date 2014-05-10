package com.writeright.mytest;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;


@Entity
@Table(name = "WordInLevel")
public class WordInLevel {
	
	public WordInLevel(){
		super();
	}
	public WordInLevel(Word word, GameLevel gameLevel, List<String> distractors) {
		super();
		this.word = word;
		this.gameLevel = gameLevel;
		this.distractors = distractors;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="word",referencedColumnName="id")
	Word word;

	@ManyToOne(optional=false, cascade=CascadeType.ALL)
	   @JoinColumn(name="gameLevel",referencedColumnName="id")
	GameLevel gameLevel;

	List<String> distractors = new ArrayList<String>(); // String and not chars because a distractor can be letter + diacritic

	public Word getWord() {
		return word;
	}

	public void setWord(Word word) {
		this.word = word;
	}

	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
	public GameLevel getGameLevel() {
		return gameLevel;
	}

	public void setGameLevel(GameLevel gameLevel) {
		this.gameLevel = gameLevel;
	}

	public List<String> getDistractors() {
		return distractors;
	}

	public void setDistractors(List<String> distractors) {
		this.distractors = distractors;
	}
}
