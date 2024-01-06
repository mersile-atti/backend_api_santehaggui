import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import ProfileGrid from "./components/ProfileGrid";

function App() {
  return <Grid templateAreas={{
    base: `"nav" "main"`,
    lg: `"nav nav" "aside main"`
  }}>
    <GridItem area="nav">
      <NavBar />
    </GridItem>
    <Show above="lg">
    <GridItem area="aside" bg='yellow'>Aside</GridItem>
    </Show>
    <GridItem area="main">
      <ProfileGrid />
      </GridItem>
  </Grid>
};

export default App;