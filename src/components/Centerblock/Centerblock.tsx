'use client';

import { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import styles from '@centerblock/centerblock.module.css';
import Search from '@search/Search';
import { data } from '@data';
import { formatTime } from '@helpers';

type ActiveFilter = 'author' | 'year' | 'genre' | null;

export default function Centerblock() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  // Уникальные авторы (без '-')
  const uniqueAuthors = Array.from(
    new Set(
      data
        .map((track) => track.author)
        .filter((author) => author !== '-')
        .sort(),
    ),
  );

  // Уникальные годы
  const uniqueYears = Array.from(
    new Set(
      data
        .map((track) => track.release_date.split('-')[0])
        .sort((a, b) => parseInt(b) - parseInt(a)),
    ),
  );

  // Уникальные жанры
  const uniqueGenres = Array.from(
    new Set(data.flatMap((track) => track.genre).filter(Boolean)),
  ).sort();

  const toggleFilter = (filter: ActiveFilter) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  };

  // Закрытие при клике вне фильтров
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target as Node)
      ) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>

      <div className={styles.centerblock__filter} ref={filterContainerRef}>
        <div className={styles.filter__title}>Искать по:</div>

        {/* Фильтр по исполнителю */}
        <div
          className={classnames(styles.filter__button, {
            [styles.filter__button_active]: activeFilter === 'author',
          })}
          onClick={() => toggleFilter('author')}
        >
          исполнителю
          {activeFilter === 'author' && (
            <div className={styles.filter__list}>
              {uniqueAuthors.map((author) => (
                <div key={author} className={styles.filter__item}>
                  {author}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Фильтр по году */}
        <div
          className={classnames(styles.filter__button, {
            [styles.filter__button_active]: activeFilter === 'year',
          })}
          onClick={() => toggleFilter('year')}
        >
          году выпуска
          {activeFilter === 'year' && (
            <div className={styles.filter__list}>
              {uniqueYears.map((year) => (
                <div key={year} className={styles.filter__item}>
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Фильтр по жанру */}
        <div
          className={classnames(styles.filter__button, {
            [styles.filter__button_active]: activeFilter === 'genre',
          })}
          onClick={() => toggleFilter('genre')}
        >
          жанру
          {activeFilter === 'genre' && (
            <div className={styles.filter__list}>
              {uniqueGenres.map((genre) => (
                <div key={genre} className={styles.filter__item}>
                  {genre}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classnames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col04)}>
            <svg className={classnames(styles.playlistTitle__svg)}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {data.map((track) => (
            <div key={track._id} className={styles.playlist__item}>
              <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                  <div className={styles.track__titleImage}>
                    <svg className={styles.track__titleSvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                    </svg>
                  </div>
                  <div>
                    <Link className={styles.track__titleLink} href="">
                      {track.name}
                      <span className={styles.track__titleSpan}></span>
                    </Link>
                  </div>
                </div>
                <div className={styles.track__author}>
                  <Link className={styles.track__authorLink} href="">
                    {track.author}
                  </Link>
                </div>
                <div className={styles.track__album}>
                  <Link className={styles.track__albumLink} href="">
                    {track.album}
                  </Link>
                </div>
                <div className={styles.track__time}>
                  <svg className={styles.track__timeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                  <span className={styles.track__timeText}>
                    {formatTime(track.duration_in_seconds)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
