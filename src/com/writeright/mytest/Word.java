package com.writeright.mytest;

import java.util.List;

import javax.persistence.*;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;




@Entity
@Table(name = "Word")
public class Word {
	
	public Word(){
		
	}
	

	public Word(Word wordObj) {
		super();
		this.word = wordObj.word;
		this.language = wordObj.language;
		this.imageFileName = wordObj.imageFileName;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String word;
	private String imageFileName;

	@ManyToOne
	   @JoinColumn(name="LANGUAGE_LANGUAGECODE",referencedColumnName="LANGUAGECODE")
	private Language language;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "word")
	 private List<WordInLevel> wordInLevels;	
	
	public int getId() {
		return id;
	}
	
	public String getWord() {
		return word;
	}
	public void setWord(String word) {
		this.word = word;
	}

	
	public void setLanguageCode(Language language) {
		this.language = language;
	}
	
	public String getLanguageCode(){
		return language.getLanguageCode();
	}

	//@com.google.appengine.repackaged.org.codehaus.jackson.annotate.JsonIgnore
	//@JsonIgnore
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
	public Language getLanguage(){
		return language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}


	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
	public List<WordInLevel> getWordInLevels() {
		return wordInLevels;
	}


	public String getImageFileName() {
		return imageFileName;
	}


	public void setImageFileName(String imageFileName) {
		this.imageFileName = imageFileName;
	}


				
}
