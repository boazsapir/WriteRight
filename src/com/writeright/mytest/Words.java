package com.writeright.mytest;

import java.io.UnsupportedEncodingException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.SynchronizationType;
import javax.inject.Named;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.utils.SystemProperty;
@Api(name = "words",
version = "v1"
)
public class Words {
	private static	   Map<String, String> properties; 
	private static	    EntityManagerFactory emf;
	private static final Logger log = Logger.getLogger(Words.class.getName()); 
	  @PersistenceContext
	  EntityManager em1;
	  static{
	    properties = new HashMap();
	    if (SystemProperty.environment.value() ==
	          SystemProperty.Environment.Value.Production) {
	      properties.put("javax.persistence.jdbc.driver",
	          "com.mysql.jdbc.GoogleDriver");
	      properties.put("javax.persistence.jdbc.url",
	          System.getProperty("cloudsql.url"));
	    } else {
	      properties.put("javax.persistence.jdbc.driver",
	          "com.mysql.jdbc.Driver");
	      properties.put("javax.persistence.jdbc.url",
	    		  System.getProperty("cloudsql.url.dev")
	          );
	    }

	    emf = Persistence.createEntityManagerFactory(
	        "Demo", properties);

	}
	  public void addStudent(Student student) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(new Student(student));
		    em.getTransaction().commit();
		    em.close();
	  }	  
	  public GameInstance newGameInstance (@Named("studentId")int studentId){
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    Student studentObject = em.find(Student.class, studentId);

		    GameInstance gameInstance = new GameInstance();
		    gameInstance.setStudent(studentObject);
		    em.persist(gameInstance);
		    em.getTransaction().commit();
		    em.close();	
		    return gameInstance;
		    
	  }
	  public void addGameTaskInstance(@Named("gameInstanceId")int gameInstanceId,
			  LetterSelectionList wrongLetterSelections, @Named("wordInLevelId")int wordInLevelId,
			  @Named("duration")int duration){

		  EntityManager em = emf.createEntityManager();
		  em.getTransaction().begin();
		  GameInstance gameInstance = em.find(GameInstance.class, gameInstanceId);
		  if(gameInstance != null){
			  WordInLevel wordInLevel = em.find(WordInLevel.class, wordInLevelId);
			  GameTaskInstance gameTaskInstance = new GameTaskInstance(gameInstance);
			  gameTaskInstance.setDuration(duration);
			  if (wrongLetterSelections.getLetterSelections().size() > 0){
				  gameTaskInstance.setWrongLetterSelections(wrongLetterSelections.getLetterSelections());
			  }
			  if (wordInLevel != null){
				  gameTaskInstance.setWordInLevel(wordInLevel);
			  }
			  em.persist(gameTaskInstance);
			  em.getTransaction().commit();		    	
		  }

		  em.close();	


	  }
	  public void addLanguage(Language language) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(new Language(language.getLanguageCode()));
		    em.getTransaction().commit();
		    em.close();
	  }
	  public void addWord(Word word) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(new Word(word));
		    Language languageObject = em.find(Language.class, word.getLanguageCode());
		    em.refresh(languageObject);
		    em.getTransaction().commit();
		    em.close();
	  }
	  
	  public void addGameType(GameType gameType) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(gameType);
		    em.getTransaction().commit();
		    em.close();
	  }
	  public void addGameLevel(GameLevel gameLevel) {
		  	EntityManager em = emf.createEntityManager();
		    em.getTransaction().begin();
		    em.persist(new GameLevel(gameLevel));
		    em.getTransaction().commit();
		    em.close();
	  }
/*	  
	  public List<Word> getAllWords() {
		  EntityManager em = emf.createEntityManager();

		    log.info("getAllWords before query");
		    List<Word> result = em
		        .createQuery("SELECT w FROM Word w")
		        .getResultList();
		    log.info("getAllWords after query");

		    em.close();
		    return result;
	  }
*/
/*
	  public MyStringList getAllLanguageCodes() {
		  EntityManager em = emf.createEntityManager();

		    List<String> result = em
		        .createQuery("SELECT l.languageCode FROM Language AS l", String.class)
		        .getResultList();

		    MyStringList retval = new MyStringList(result);
		    em.close();
		    return retval;
	  }
*/
/*
	  @ApiMethod(name = "getAllLanguageCodesTest", path = "get_all_language_test")
	  public MyStringList getAllLanguageCodesTest() {
		  EntityManager em = emf.createEntityManager();
log.info("before query");

		    List<String> result = em
		        .createQuery("SELECT l.languageCode FROM LanguageCodeTest AS l", String.class)
		        .getResultList();
		    log.info("after query");

		    log.info("result.size =" + result.size());
		    log.info(result.toString());
		    MyStringList retval = new MyStringList(result);
		    em.close();
		    return retval;
	  }
*/
/*
	  public List<Language> getAllLanguages() {
		  EntityManager em = emf.createEntityManager();

		    List<Language> result = em
		        .createQuery("SELECT l FROM Language l")
		        .getResultList();


		    em.close();
		    return result;
	  }	
*/
	  public void addDistractor(@Named("id")int id, @Named("distractor")String distractor){
		  String decodedDistractor = null;
		  try {
			  decodedDistractor = java.net.URLDecoder.decode(distractor, "UTF-8");
		  } catch (UnsupportedEncodingException e) {
			  // TODO Auto-generated catch block
			  e.printStackTrace();
		  }
		  EntityManager em = emf.createEntityManager();
		  em.getTransaction().begin();
		  WordInLevel wordInLevel = em.find(WordInLevel.class, id);
		  List<String> distractors = wordInLevel.getDistractors();
		  if (distractors == null){
			  distractors = new ArrayList<String>();
		  }
		  wordInLevel.setDistractors(distractors);
		  distractors.add(decodedDistractor);		  
		  em.getTransaction().commit();
		  em.close();
	  }
	  
	  public void reduceDistractors(@Named("id")int id, @Named("reduceTo")int reduceTo){

		  EntityManager em = emf.createEntityManager();
		  em.getTransaction().begin();
		  WordInLevel wordInLevel = em.find(WordInLevel.class, id);
		  List<String> distractors = wordInLevel.getDistractors();
		  if (distractors != null){
			  for (int i=0; i<distractors.size();){
				  if(i >= reduceTo){
					  distractors.remove(i);
				  }
				  else{
					  i++;
				  }
			  }
		  }			  
		  em.getTransaction().commit();
		  em.close();
	  }

	  public List<String> getDistractors(@Named("id")int id){
		  	EntityManager em = emf.createEntityManager();

		    WordInLevel wordInLevel = em.find(WordInLevel.class, id);
		    em.close();
		    return wordInLevel.distractors;

	  }
	  public GameTaskInstance getGameTaskInstance(@Named("gameTaskInstanceId")int id){
		  	EntityManager em = emf.createEntityManager();

		    GameTaskInstance gameTaskInstance = em.find(GameTaskInstance.class, id);
		    em.close();
		    return gameTaskInstance;
		    

	  }

	  public GameInstance getGameInstance(@Named("gameInstanceId")int id){
		  	EntityManager em = emf.createEntityManager();

		    GameInstance gameInstance = em.find(GameInstance.class, id);
		    em.refresh(gameInstance);
		    em.close();
		    return gameInstance;
		    

	  }	  
	  /*
	  @ApiMethod(name = "getWordsByLanguage", path = "get_words_by_language")
	  public List<Word> getWordsByLanguage(@Named("languageCode")String languageCode) {
		  EntityManager em = emf.createEntityManager();
//		  Query query = em.createQuery("SELECT w FROM Word w Where w.language=:arg1");
//		  query.setParameter("arg1", language);	
//		  List<Word> result = query.getResultList();
		  Language languageObject = em.find(Language.class, languageCode);
		  em.close();
		  if (languageObject != null){
			  return languageObject.getWords();
		  }
		  else{
			  return null;
		  }


	  }
*/	  
	  @ApiMethod(name = "getGameLevels", path = "get_game_levels")
	  public List<GameLevel> getGameLevels(@Named("gameTypeId")int id) {

		  EntityManager em = emf.createEntityManager();
//		  Query query = em.createQuery("SELECT w FROM Word w Where w.language=:arg1");
//		  query.setParameter("arg1", language);	
//		  List<Word> result = query.getResultList();
		  GameType gameType = em.find(GameType.class, id);
		  List<GameLevel> retVal = null;
		  if (gameType != null){
			  List<GameLevel> gameLevels =  gameType.getGameLevels();
//			  List<Integer> levels = new ArrayList<Integer>();
//			  for (int i=0; i<gameLevels.size();i++){
//				  levels.add(gameLevels.get(i).getLevelIndex());
//			  }
			  retVal = gameLevels;
		  }
	
		  em.close();
		  return retVal;
	  }
	  @ApiMethod(name = "getWordsByLevel", path = "get_words_for_level")
	  public List<WordInLevel> getWordsByLevel(@Named("gameTypeId")int id, @Named("levelIndex") int index) {

		    List<WordInLevel> retVal = null;
		  EntityManager em = emf.createEntityManager(/*SynchronizationType.SYNCHRONIZED*/);
		  Query query = em.createQuery("SELECT gl FROM GameLevel gl Where gl.gameType.id=:arg1 And gl.levelIndex=:arg2");
		  query.setParameter("arg1", id);
		  query.setParameter("arg2", index);
		  List<GameLevel> queryResult = query.getResultList();
		  if (queryResult != null && queryResult.size() == 1){
			  GameLevel gameLevel = queryResult.get(0);
			  retVal = gameLevel.getWordsInLevel();
		  }
		  else{
			  retVal = null;
		  }
		  em.close();
		  return retVal;
	  }
	  	  
	  
}
