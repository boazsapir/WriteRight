package com.writeright.mytest;

import java.util.List;

public class MyIntegerList {
	public MyIntegerList(List<Integer> value) {
		super();
		this.value = value;
	}
	
	public MyIntegerList(){
		super();
	}

	private List<Integer> value;

	public List<Integer> getValue() {
		return value;
	}

	public void setValue(List<Integer> value) {
		this.value = value;
	}
}
