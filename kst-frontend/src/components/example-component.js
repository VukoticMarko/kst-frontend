const ExampleComponent = ({ onClick, label }) => {
    return (
      <button onClick={onClick}>
        {label}
      </button>
    );
  };

export default ExampleComponent