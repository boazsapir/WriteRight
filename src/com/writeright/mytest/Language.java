package com.writeright.mytest;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;


@Entity
@Table(name = "Language")
public class Language {
	
	public Language(){
	}

	public Language(String languageCode) {
		super();
		this.languageCode = languageCode;
	}

	@Id
	private String languageCode;

	 @OneToMany(mappedBy = "language")
	  private  List<Word> words = new ArrayList<Word>();
	 
	public String getLanguageCode() {
		return languageCode;
	}

	public void setLanguageCode(String languageCode) {
		this.languageCode = languageCode;
	}


	 public List<Word> getWords() {
		return words;
	}

	public void setWords(List<Word> words) {
		this.words = words;
	}
	
	

}
