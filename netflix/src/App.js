import React, {useEffect, useState} from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeatureMovie from './components/FeatureMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setfeatureData] = useState(null);
  const[blackHeader,setBlackHeader] = useState(false);
  
  useEffect(()=>{
    const loadAll = async () =>{
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug === 'originals');
      let randonChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randonChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id,'tv');

      setfeatureData(chosenInfo);
    }

    loadAll();
  },[]);

  useEffect(()=>{
    const scrollListener = () => {
        if(window.scrollY > 10){
          setBlackHeader(true);
        }else{
          setBlackHeader(false);
        }
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll',scrollListener);
    }
  }, []);
  return(
    <div className="page">
      <Header black={blackHeader}/>
    
     
     {
       featureData && 
       <FeatureMovie item = {featureData}/>
     }
      <section className= "lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
        ))}
      </section>
      <footer>
        Feito como exercicio de treino pela b7Web<br/>
        Direitos de imagem para Netflix<br/>
      </footer>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" />

      </div>
      }
    </div>
  );
}