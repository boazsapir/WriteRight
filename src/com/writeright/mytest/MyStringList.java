package com.writeright.mytest;

import java.util.List;

public class MyStringList {
	public MyStringList(List<String> value) {
		super();
		this.value = value;
	}
	public MyStringList() {
	}

	private List<String> value;

	public List<String> getValue() {
		return value;
	}
	public void setValue(List<String> value) {
		this.value = value;
	}
	
	
}
