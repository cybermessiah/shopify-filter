import React, { useState, useEffect } from "react"
import JSONData from "../../data/shopify.json"
const ListProducts = () => {

  //Unique values method
  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  //Obtain all distinct Categories
  const categories = []
  const categoriesFetched =
  JSONData.data.allContentfulProductPage.edges.map((data, index) => {
    const tagsToSplit = data.node.categoryTags?.toString()
    const tagsConverted = tagsToSplit?.split(",")
    tagsConverted?.map((el) => {
      return categories.push(el.trim())
    })
  })  
  const uniqueCategories = categories.filter(unique)

  const [categoryFilter, setCategoryFilter] = useState(0)
  const [colorFilter, setColorFilter] = useState(0)
  const [priceFilter, setPriceFilter] = useState(0)

  // Filter by Category, Color and Price
  const [filteredProducts, setFilteredProducts] = useState([])

  // Display All Products
  useEffect(() => {
    JSONData.data.allContentfulProductPage.edges.map((data, index) => {
      setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
    })
  }, [])  
  
  // Filtered Products
  useEffect(() => {
    JSONData.data.allContentfulProductPage.edges.map((data, index) => {
      if (categoryFilter === 0 && colorFilter === 0 && priceFilter === 0){
          return
        }
      if (categoryFilter !== 0 && colorFilter === 0 && priceFilter === 0
        && data.node.categoryTags?.includes(categoryFilter)){
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
      if (categoryFilter === 0 && colorFilter !== 0 && priceFilter === 0
        && data.node.colorFamily?.some(e => e.name === colorFilter)){
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
      if (categoryFilter !== 0 && colorFilter !== 0 && priceFilter === 0
        && data.node.categoryTags?.includes(categoryFilter)
        && data.node.colorFamily?.some(e => e.name === colorFilter))
        {
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
      if (categoryFilter !== 0 && colorFilter !== 0 && priceFilter !== 0
        && data.node.categoryTags?.includes(categoryFilter)
        && data.node.colorFamily?.some(e => e.name === colorFilter)
        && priceRange(data?.node.shopifyProductEu.variants?.edges, priceFilter))
        {
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
      if (categoryFilter === 0 && colorFilter !== 0 && priceFilter !== 0
        && data.node.colorFamily?.some(e => e.name === colorFilter)
        && priceRange(data?.node.shopifyProductEu.variants?.edges, priceFilter))
        {
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
      if (categoryFilter === 0 && colorFilter === 0 && priceFilter !== 0
        && priceRange(data?.node.shopifyProductEu.variants?.edges, priceFilter))
        {
        setFilteredProducts(filteredProducts => [...filteredProducts, data.node.name])
        }
    })
    return function cleanup() {
      setFilteredProducts([])
    }
  }, [categoryFilter, colorFilter, priceFilter])

  //Obtain all distinct Colors
    const colors = []
    const colorsFetched =
    JSONData.data.allContentfulProductPage.edges.map((data, index) => {
      data.node.colorFamily?.forEach(element => 
        colors.push(element.name)) 
    })
    const uniqueColors = colors.filter(unique)

  //Check the Price Range method
    const priceRange = (priceToFilter,value) => {
      if(value === "Below 200"){
        return priceToFilter?.some(e => parseFloat(e.node.price) <= 200.00)
      }
      if(value === "200-400"){
        return priceToFilter?.some(e => parseFloat(e.node.price) > 200 && parseFloat(e.node.price) < 400.00)
      }
      if(value === "Above 400"){
        return priceToFilter?.some(e => parseFloat(e.node.price) >= 400.00)
      }
    }
    

  return(
  <div style={{ maxWidth: `960px`, margin: `1.45rem` }}>
    
    <h4>By Category: {categoryFilter}</h4>
    {uniqueCategories.map((categoryToPick, index) => {
        return <button 
                type="button" 
                class="btn btn-outline-dark btn-sm m-1"
                onClick={() => setCategoryFilter(categoryToPick)}>
                {categoryToPick}
              </button>
    })}
  
    <h4 className="mt-4">By Color: {colorFilter}</h4>
    {uniqueColors.map((colorToPick, index) => {
        return <button 
                type="button" 
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => setColorFilter(colorToPick)}>
                {colorToPick}
              </button>
    })}
  
    <h4 className="mt-4">By Price: {priceFilter}</h4>

       <button 
                type="button" 
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => setPriceFilter("Below 200")}
                >
                Below 200
      </button>
       <button 
                type="button" 
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => setPriceFilter("200-400")}
                >
                200 - 400
      </button>
       <button 
                type="button" 
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => setPriceFilter("Above 400")}
                >
                Above 400
      </button>

      <h1>Products To Filter</h1>
      <p>{filteredProducts? filteredProducts.slice(0, 30) : 0 }</p>

  </div>
  )
}
export default ListProducts