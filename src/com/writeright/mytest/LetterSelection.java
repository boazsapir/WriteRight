package com.writeright.mytest;

import java.io.Serializable;

public class LetterSelection implements Serializable{

	public LetterSelection() {
		// TODO Auto-generated constructor stub
	}

	private int index;
	private String letter; // can include diacritics therefore more than one letter
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getLetter() {
		return letter;
	}
	public void setLetter(String letter) {
		this.letter = letter;
	}
	public LetterSelection(int index, String letter) {
		super();
		this.index = index;
		this.letter = letter;
	}


}
