using HotChocolate;
using HotChocolate.Types;
using Xunit;
using INFWAD.Calendar.Backend.GraphQL;
using INFWAD.Calendar.Backend.Models;

namespace INFWAD.Calendar.Backend.Tests;

public class SchemaTests
{
    [Fact]
    public void Schema_Includes_Event_Type()
    {
        var schema = SchemaBuilder.New()
            .AddQueryType<Query>()
            .AddType<ObjectType<Event>>()
            .Create();

        Assert.NotNull(schema.GetType<ObjectType>("Event"));
    }
}
