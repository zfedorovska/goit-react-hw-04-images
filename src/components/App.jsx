import { useState, useEffect } from 'react';
import galleryAPI from 'services/gallery-api';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';

const Status = {
  IDDLE: 'iddle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  NOTFOUND: 'notFound',
};

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const [galleryItemsList, setGalleryItemsList] = useState([]);
  const [activeImageLargeUrl, setActiveImageLargeUrl] = useState('');
  const [status, setStatus] = useState(Status.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (searchValue === '') return;
    setStatus(Status.PENDING);
    galleryAPI
      .fetchGallery(searchValue, page)
      .then(response => {
        const hits = mapHitsArray(response.hits);
        let actualStatus =
          hits.length === 0 && page === 1 ? Status.NOTFOUND : Status.RESOLVED;
        setStatus(actualStatus);
        setGalleryItemsList(prevGalleryItemsList => [
          ...prevGalleryItemsList,
          ...hits,
        ]);
        setTotalHits(response.totalHits);
      })
      .catch(error => {
        setStatus(Status.REJECTED);
      });
  }, [searchValue, page]);

  const mapHitsArray = array => {
    return array.map(({ webformatURL, tags, id, largeImageURL }) => ({
      webformatURL,
      tags,
      id,
      largeImageURL,
    }));
  };

  const handleLoadMoreButton = () => {
    setPage(state => state + 1);
  };

  const handleGalleryItemClick = event => {
    setActiveImageLargeUrl(event.target.dataset.largeurl);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(state => !state);
  };

  const handleFormSubmit = searchValue => {
    setSearchValue(searchValue);
    setGalleryItemsList([]);
    setPage(1);
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      <div>
        <ImageGallery
          galleryItemsList={galleryItemsList}
          handleGalleryItemClick={handleGalleryItemClick}
        />
        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={activeImageLargeUrl} alt="" />
          </Modal>
        )}
        {totalHits > galleryItemsList.length > 0 && (
          <Button onClick={handleLoadMoreButton} />
        )}
      </div>
      {status === 'notFound' && <p>No pictures are found by query</p>}
      {status === 'rejected' && <p>Server returns error</p>}
      {status === 'pending' && <Loader />}
    </div>
  );
}
