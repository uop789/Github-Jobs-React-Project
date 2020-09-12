import React, { useState } from 'react';
import useFetchJobs from './useFetchJobs';
import { Container } from 'react-bootstrap';
import Job from './Job';
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState({
    description: '',
    location: '',
    full_time: false,
  });
  const [page, setPage] = useState(1);

  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  function handleParamChange(e) {
    const param = e.target.name;
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPage(1);
    setParams({ ...params, [param]: value }); 
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Github Jobs</h1>
      <SearchForm params={params} onInputsChange={handleParamChange} />
      {!loading && !error && jobs.lenth > 0 && (
        <JobsPagination
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
        />
      )}
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error. Please refresh.</h1>}
      {jobs.map((job) => (
        <Job key={job.id} job={job} />
      ))}
      {!loading && !error && jobs.lenth > 0 && (
        <JobsPagination
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
        />
      )}
    </Container>
  );
}

export default App;
