import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  //API OMDB

  getMovieBySearchTerm(query: any) {
    return this.http.get(`https://www.omdbapi.com/?apikey=d3f6c0ee&t=${query}`);
  }

  getMoviesBySearchTerm(query: any) {
    return this.http.get(`https://www.omdbapi.com/?apikey=d3f6c0ee&s=${query}`);
  }

  getMovieById(query: any) {
    return this.http.get(`https://www.omdbapi.com/?apikey=d3f6c0ee&i=${query}`);
  }

  async getMovieByIdAsync(query: any){
    return await fetch(`https://www.omdbapi.com/?apikey=d3f6c0ee&i=${query}`);
  }

  // API TheMovieDb

  // attribut "original_title"
  getMovieTMDbId(query: any) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${query}?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US`);
  }

  async getMovieTMDbIdAsync(query: any) {
    return await fetch(`https://api.themoviedb.org/3/movie/${query}?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US`);
  }

  // permet de recuperer aussi l'id TMDB
  getMovieTMDBByIMDBID(query: any) {
    return this.http.get(`https://api.themoviedb.org/3/find/${query}?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&external_source=imdb_id`)
  }

  async getMovieTMDBByIMDBIDAsync(query: any){
    return await fetch(`https://api.themoviedb.org/3/find/${query}?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&external_source=imdb_id`)
  }

  getMoviesTMDBTitleSearch(query: any) {
    return this.http.get(`https://api.themoviedb.org/3/search/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&query=${query}&page=1&include_adult=false`);
  }

  async getMoviesTMDBTitleSearchAllPages(query: any) {
    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&query=${query}&page=1&include_adult=false`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&query=${query}&page=${i}&include_adult=false`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getReviewsTMDB(query: any) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${query}/reviews?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&page=1`);
  }

  async getReviewsTMDBAllPages(query: any) {
    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/movie/${query}/reviews?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/movie/${query}/reviews?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;

  }

  getCastTMDB(query: any) {
    return this.http.get(`http://api.themoviedb.org/3/movie/${query}/casts?api_key=11d68f95601d6ec7858fe9a41e26fd86`);
  }

  getCreditsTMDB(query: any) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${query}/credits?api_key=11d68f95601d6ec7858fe9a41e26fd86&language=en-US`);
  }

  async getMovieTranslations(movieId: any) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/translations?api_key=11d68f95601d6ec7858fe9a41e26fd86`);
    const data = await response.json();
    return data;
  }

  getActorsIdByActorsName(query: any){
    return this.http.get(`https://api.themoviedb.org/3/search/person?api_key=11d68f95601d6ec7858fe9a41e26fd86&query=${query}`)
  }

  getPerson(query: any){
    return this.http.get(`https://api.themoviedb.org/3/search/person?api_key=11d68f95601d6ec7858fe9a41e26fd86&query=${query}`)
  }

  getMoviesByRealisatorId(query: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_crew=${query}&crew_job=Director`)
  }

  async getMoviesByRealisatorIdAllPages(query: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_crew=${query}&crew_job=Director&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_crew=${query}&crew_job=Director&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getMoviesByActorId(query: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${query}`)
  }

  async getMoviesByActorIdAllPages(query: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${query}&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${query}&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getMoviesByActorsAndRealisator(actorsQuery: any, realisatorQuery: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${actorsQuery}&with_crew=${realisatorQuery}`);
  }

  async getMoviesByActorsAndRealisatorAllPages(actorsQuery: any, realisatorQuery: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${actorsQuery}&with_crew=${realisatorQuery}&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&with_cast=${actorsQuery}&with_crew=${realisatorQuery}&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getMoviesByYear(query: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${query}`)
  }

  async getMoviesByYearAllPages(query: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${query}&page=1`);
    let data = await response.json();
    results.push(...data.results);


    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${query}&page=${i}`);
      data = await response.json();
      results.push(...data.results);
      if (i == 500) break;
    }

    return results;
  }

  getMoviesByYearAndActors(yearQuery: any, actorsQuery: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_cast=${actorsQuery}`)
  }

  async getMoviesByYearAndActorsAllPages(yearQuery: any, actorsQuery: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_cast=${actorsQuery}&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_cast=${actorsQuery}&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getMoviesByYearAndRealisator(yearQuery: any, realisatorQuery: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director`)
  }

  async getMoviesByYearAndRealisatorAllPages(yearQuery: any, realisatorQuery: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

  getMoviesByYearAndActorsAndRealisator(yearQuery: any, actorsQuery: any, realisatorQuery: any){
    return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director&with_cast=${actorsQuery}`)
  }

  async getMoviesByYearAndActorsAndRealisatorAllPages(yearQuery: any, actorsQuery: any, realisatorQuery: any){

    const results = [];

    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director&with_cast=${actorsQuery}&page=1`);
    let data = await response.json();
    results.push(...data.results);

    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d68f95601d6ec7858fe9a41e26fd86&primary_release_year=${yearQuery}&with_crew=${realisatorQuery}&crew_job=Director&with_cast=${actorsQuery}&page=${i}`);
      data = await response.json();
      results.push(...data.results);
    }

    return results;
  }

}
